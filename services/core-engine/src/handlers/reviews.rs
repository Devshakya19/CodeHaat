use actix_web::{web, HttpResponse};
use crate::services::{AppState, ApiResponse, supabase::SupabaseClient};
use crate::models::{Review, CreateReviewRequest};

pub async fn list_reviews(
    state: web::Data<AppState>,
    path: web::Path<String>,
) -> HttpResponse {
    let client = SupabaseClient::new(&state);
    let product_id = path.into_inner();

    match client.query::<Vec<Review>>("reviews", &format!("product_id=eq.{}&order=created_at.desc", product_id)).await {
        Ok(reviews) => HttpResponse::Ok().json(ApiResponse::success(reviews, "Reviews fetched")),
        Err(e) => HttpResponse::InternalServerError().json(ApiResponse::<()>::error(&e)),
    }
}

pub async fn create_review(
    state: web::Data<AppState>,
    body: web::Json<CreateReviewRequest>,
) -> HttpResponse {
    let client = SupabaseClient::new(&state);

    // TODO: Get user_id from JWT and verify purchase
    let review = serde_json::json!({
        "product_id": body.product_id,
        "user_id": "00000000-0000-0000-0000-000000000000",
        "order_id": body.order_id,
        "rating": body.rating,
        "title": body.title,
        "comment": body.comment,
    });

    match client.insert::<_, Review>("reviews", &review).await {
        Ok(review) => HttpResponse::Ok().json(ApiResponse::success(review, "Review created")),
        Err(e) => HttpResponse::InternalServerError().json(ApiResponse::<()>::error(&e)),
    }
}
