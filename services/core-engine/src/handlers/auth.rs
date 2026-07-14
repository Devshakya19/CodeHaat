use actix_web::{web, HttpResponse};
use serde::{Deserialize, Serialize};
use crate::services::{AppState, ApiResponse};

#[derive(Debug, Deserialize)]
pub struct VerifyRequest {
    pub token: String,
}

#[derive(Debug, Serialize)]
pub struct VerifyResponse {
    pub user_id: String,
    pub email: String,
    pub role: String,
}

pub async fn verify_token(
    state: web::Data<AppState>,
    body: web::Json<VerifyRequest>,
) -> HttpResponse {
    // TODO: Verify JWT token against Supabase
    // For now, return a placeholder
    HttpResponse::Ok().json(ApiResponse::success(
        VerifyResponse {
            user_id: "placeholder".to_string(),
            email: "placeholder@example.com".to_string(),
            role: "user".to_string(),
        },
        "Token verified",
    ))
}
