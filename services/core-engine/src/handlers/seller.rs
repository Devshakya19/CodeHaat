use actix_web::{web, HttpResponse};
use uuid::Uuid;
use crate::services::{AppState, ApiResponse, supabase::SupabaseClient};
use crate::models::{Product, CreateProductRequest, UpdateProductRequest, SellerStats};

pub async fn create_product(
    state: web::Data<AppState>,
    body: web::Json<CreateProductRequest>,
) -> HttpResponse {
    let client = SupabaseClient::new(&state);

    // TODO: Get seller_id from JWT token
    let seller_id = Uuid::parse_str("00000000-0000-0000-0000-000000000000").unwrap();

    let slug = body.title.to_lowercase().replace(" ", "-");

    let product = serde_json::json!({
        "seller_id": seller_id,
        "title": body.title,
        "slug": slug,
        "description": body.description,
        "long_description": body.long_description,
        "price_paise": body.price_paise,
        "original_price_paise": body.original_price_paise,
        "category_id": body.category_id,
        "tags": body.tags,
        "github_repo_url": body.github_repo_url,
        "image_url": body.image_url,
        "demo_url": body.demo_url,
        "tech_stack": body.tech_stack,
        "status": "active"
    });

    match client.insert::<_, Product>("products", &product).await {
        Ok(product) => HttpResponse::Ok().json(ApiResponse::success(product, "Product created")),
        Err(e) => HttpResponse::InternalServerError().json(ApiResponse::<()>::error(&e)),
    }
}

pub async fn update_product(
    state: web::Data<AppState>,
    path: web::Path<String>,
    body: web::Json<UpdateProductRequest>,
) -> HttpResponse {
    let client = SupabaseClient::new(&state);
    let id = path.into_inner();

    match client.update::<_, Product>("products", &id, &body.0).await {
        Ok(product) => HttpResponse::Ok().json(ApiResponse::success(product, "Product updated")),
        Err(e) => HttpResponse::InternalServerError().json(ApiResponse::<()>::error(&e)),
    }
}

pub async fn delete_product(
    state: web::Data<AppState>,
    path: web::Path<String>,
) -> HttpResponse {
    let client = SupabaseClient::new(&state);
    let id = path.into_inner();

    match client.delete("products", &id).await {
        Ok(_) => HttpResponse::Ok().json(ApiResponse::<()> {
            success: true,
            data: None,
            message: Some("Product deleted".to_string()),
            error: None,
        }),
        Err(e) => HttpResponse::InternalServerError().json(ApiResponse::<()>::error(&e)),
    }
}

pub async fn get_stats(
    state: web::Data<AppState>,
) -> HttpResponse {
    // TODO: Get seller_id from JWT and fetch real stats
    let stats = SellerStats {
        total_products: 0,
        active_products: 0,
        total_sales: 0,
        total_revenue_paise: 0,
        total_earned_paise: 0,
    };

    HttpResponse::Ok().json(ApiResponse::success(stats, "Stats fetched"))
}
