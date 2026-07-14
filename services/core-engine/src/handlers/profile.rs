use actix_web::{web, HttpResponse};
use crate::services::{AppState, ApiResponse, supabase::SupabaseClient};
use crate::models::Profile;

pub async fn get_profile(
    state: web::Data<AppState>,
    path: web::Path<String>,
) -> HttpResponse {
    let client = SupabaseClient::new(&state);
    let id = path.into_inner();

    match client.query::<Vec<Profile>>("profiles", &format!("id=eq.{}", id)).await {
        Ok(profiles) => {
            match profiles.into_iter().next() {
                Some(profile) => HttpResponse::Ok().json(ApiResponse::success(profile, "Profile fetched")),
                None => HttpResponse::NotFound().json(ApiResponse::<()>::error("Profile not found")),
            }
        }
        Err(e) => HttpResponse::InternalServerError().json(ApiResponse::<()>::error(&e)),
    }
}

pub async fn update_profile(
    state: web::Data<AppState>,
    body: web::Json<serde_json::Value>,
) -> HttpResponse {
    let client = SupabaseClient::new(&state);

    let user_id = body.get("id").and_then(|v| v.as_str()).unwrap_or("");

    if user_id.is_empty() {
        return HttpResponse::BadRequest().json(ApiResponse::<()>::error("User ID is required"));
    }

    // Check if profile exists
    let existing = client.query::<Vec<serde_json::Value>>("profiles", &format!("id=eq.{}", user_id)).await;

    let result = match existing {
        Ok(profiles) if !profiles.is_empty() => {
            // Update existing profile
            client.update::<_, serde_json::Value>("profiles", user_id, &body).await
        }
        _ => {
            // Insert new profile
            client.insert::<_, serde_json::Value>("profiles", &body).await
        }
    };

    match result {
        Ok(_) => HttpResponse::Ok().json(ApiResponse::<()> {
            success: true,
            data: None,
            message: Some("Profile updated successfully".to_string()),
            error: None,
        }),
        Err(e) => HttpResponse::InternalServerError().json(ApiResponse::<()>::error(&e)),
    }
}
