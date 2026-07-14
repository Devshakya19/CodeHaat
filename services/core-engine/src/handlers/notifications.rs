use actix_web::{web, HttpResponse};
use crate::services::{AppState, ApiResponse, supabase::SupabaseClient};
use crate::models::Notification;

pub async fn list_notifications(
    state: web::Data<AppState>,
) -> HttpResponse {
    let client = SupabaseClient::new(&state);

    // TODO: Get user_id from JWT token
    let query = "user_id=eq.00000000-0000-0000-0000-000000000000&order=created_at.desc";

    match client.query::<Vec<Notification>>("notifications", query).await {
        Ok(notifications) => HttpResponse::Ok().json(ApiResponse::success(notifications, "Notifications fetched")),
        Err(e) => HttpResponse::InternalServerError().json(ApiResponse::<()>::error(&e)),
    }
}

pub async fn mark_read(
    state: web::Data<AppState>,
    path: web::Path<String>,
) -> HttpResponse {
    let client = SupabaseClient::new(&state);
    let id = path.into_inner();

    match client.update::<_, Notification>("notifications", &id, &serde_json::json!({"is_read": true})).await {
        Ok(_) => HttpResponse::Ok().json(ApiResponse::<()> {
            success: true,
            data: None,
            message: Some("Notification marked as read".to_string()),
            error: None,
        }),
        Err(e) => HttpResponse::InternalServerError().json(ApiResponse::<()>::error(&e)),
    }
}
