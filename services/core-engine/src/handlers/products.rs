use actix_web::{web, HttpResponse};
use crate::services::{AppState, ApiResponse, supabase::SupabaseClient};
use crate::models::Product;

pub async fn list_products(
    state: web::Data<AppState>,
    query: web::Query<std::collections::HashMap<String, String>>,
) -> HttpResponse {
    let client = SupabaseClient::new(&state);

    // Build query string from params
    let mut query_str = String::from("status=eq.active&order=created_at.desc");
    if let Some(category) = query.get("category") {
        query_str.push_str(&format!("&category_id=eq.{}", category));
    }
    if let Some(search) = query.get("search") {
        query_str.push_str(&format!("&or=(title.ilike.%{}%,description.ilike.%{}%)", search, search));
    }

    match client.query::<Vec<Product>>("products", &query_str).await {
        Ok(products) => HttpResponse::Ok().json(ApiResponse::success(products, "Products fetched")),
        Err(e) => HttpResponse::InternalServerError().json(ApiResponse::<()>::error(&e)),
    }
}

pub async fn get_product(
    state: web::Data<AppState>,
    path: web::Path<String>,
) -> HttpResponse {
    let client = SupabaseClient::new(&state);
    let id = path.into_inner();

    match client.query::<Vec<Product>>("products", &format!("id=eq.{}", id)).await {
        Ok(products) => {
            match products.into_iter().next() {
                Some(product) => HttpResponse::Ok().json(ApiResponse::success(product, "Product fetched")),
                None => HttpResponse::NotFound().json(ApiResponse::<()>::error("Product not found")),
            }
        }
        Err(e) => HttpResponse::InternalServerError().json(ApiResponse::<()>::error(&e)),
    }
}
