use actix_web::{web, HttpResponse};
use uuid::Uuid;
use crate::services::{AppState, ApiResponse, supabase::SupabaseClient};
use crate::models::{Order, CreateOrderRequest};

pub async fn create_order(
    state: web::Data<AppState>,
    body: web::Json<CreateOrderRequest>,
) -> HttpResponse {
    let client = SupabaseClient::new(&state);

    // TODO: Verify payment with Razorpay, then create order
    // For now, return a placeholder
    HttpResponse::Ok().json(ApiResponse::<()> {
        success: true,
        data: None,
        message: Some("Order creation will be implemented with Razorpay".to_string()),
        error: None,
    })
}

pub async fn list_orders(
    state: web::Data<AppState>,
) -> HttpResponse {
    let client = SupabaseClient::new(&state);

    // TODO: Get user_id from JWT and filter by role (buyer_id or seller_id)
    let query = "order=created_at.desc";

    match client.query::<Vec<Order>>("orders", query).await {
        Ok(orders) => HttpResponse::Ok().json(ApiResponse::success(orders, "Orders fetched")),
        Err(e) => HttpResponse::InternalServerError().json(ApiResponse::<()>::error(&e)),
    }
}

pub async fn get_order(
    state: web::Data<AppState>,
    path: web::Path<String>,
) -> HttpResponse {
    let client = SupabaseClient::new(&state);
    let id = path.into_inner();

    match client.query::<Vec<Order>>("orders", &format!("id=eq.{}", id)).await {
        Ok(orders) => {
            match orders.into_iter().next() {
                Some(order) => HttpResponse::Ok().json(ApiResponse::success(order, "Order fetched")),
                None => HttpResponse::NotFound().json(ApiResponse::<()>::error("Order not found")),
            }
        }
        Err(e) => HttpResponse::InternalServerError().json(ApiResponse::<()>::error(&e)),
    }
}
