use actix_web::{web, HttpResponse};
use crate::services::{AppState, ApiResponse, supabase::SupabaseClient};
use crate::models::{Wallet, TopupRequest};

pub async fn get_balance(
    state: web::Data<AppState>,
) -> HttpResponse {
    let client = SupabaseClient::new(&state);

    // TODO: Get user_id from JWT token
    let query = "user_id=eq.00000000-0000-0000-0000-000000000000";

    match client.query::<Vec<Wallet>>("wallets", query).await {
        Ok(wallets) => {
            match wallets.into_iter().next() {
                Some(wallet) => HttpResponse::Ok().json(ApiResponse::success(wallet, "Balance fetched")),
                None => HttpResponse::NotFound().json(ApiResponse::<()>::error("Wallet not found")),
            }
        }
        Err(e) => HttpResponse::InternalServerError().json(ApiResponse::<()>::error(&e)),
    }
}

pub async fn topup(
    state: web::Data<AppState>,
    body: web::Json<TopupRequest>,
) -> HttpResponse {
    // TODO: Implement Razorpay integration
    // For now, return a placeholder
    HttpResponse::Ok().json(ApiResponse::<()> {
        success: true,
        data: None,
        message: Some("Top-up will be implemented with Razorpay".to_string()),
        error: None,
    })
}
