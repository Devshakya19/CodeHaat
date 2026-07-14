use actix_web::{web, HttpResponse};
use crate::services::{AppState, ApiResponse, supabase::SupabaseClient};
use crate::models::{Order, CreateOrderRequest};

pub async fn create_order(
    _state: web::Data<AppState>,
    _body: web::Json<CreateOrderRequest>,
) -> HttpResponse {
    // TODO: Implement order creation with Razorpay
    HttpResponse::Ok().json(ApiResponse::<()> {
        success: true,
        data: None,
        message: Some("Order creation will be implemented with Razorpay".to_string()),
        error: None,
    })
}

pub async fn list_orders(
    state: web::Data<AppState>,
    query: web::Query<std::collections::HashMap<String, String>>,
) -> HttpResponse {
    let client = SupabaseClient::new(&state);

    // Build query string from params
    let mut query_str = String::from("order=created_at.desc");
    if let Some(buyer_id) = query.get("buyer_id") {
        query_str.push_str(&format!("&buyer_id=eq.{}", buyer_id));
    }
    if let Some(seller_id) = query.get("seller_id") {
        query_str.push_str(&format!("&seller_id=eq.{}", seller_id));
    }
    if let Some(status) = query.get("status") {
        query_str.push_str(&format!("&status=eq.{}", status));
    }

    match client.query::<Vec<Order>>("orders", &query_str).await {
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
