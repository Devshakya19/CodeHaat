use actix_web::{web, App, HttpServer, middleware::Logger};
use dotenv::dotenv;
use std::env;

mod handlers;
mod models;
mod services;
mod middleware;
mod utils;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    let port = env::var("PORT").unwrap_or_else(|_| "4001".to_string());
    let database_url = env::var("SUPABASE_URL").expect("SUPABASE_URL must be set");
    let supabase_key = env::var("SUPABASE_SERVICE_ROLE_KEY").expect("SUPABASE_SERVICE_ROLE_KEY must be set");

    log::info!("Starting CodeHaat Core Engine on port {}", port);

    HttpServer::new(move || {
        App::new()
            .wrap(Logger::default())
            .app_data(web::Data::new(services::AppState {
                supabase_url: database_url.clone(),
                supabase_key: supabase_key.clone(),
            }))
            // Health check
            .route("/health", web::get().to(handlers::health::health_check))
            // Auth
            .route("/api/auth/verify", web::post().to(handlers::auth::verify_token))
            // Profile
            .route("/api/profile/{id}", web::get().to(handlers::profile::get_profile))
            .route("/api/profile", web::put().to(handlers::profile::update_profile))
            // Products
            .route("/api/products", web::get().to(handlers::products::list_products))
            .route("/api/products/{id}", web::get().to(handlers::products::get_product))
            // Seller products
            .route("/api/seller/products", web::get().to(handlers::seller::list_seller_products))
            .route("/api/seller/products", web::post().to(handlers::seller::create_product))
            .route("/api/seller/products/{id}", web::put().to(handlers::seller::update_product))
            .route("/api/seller/products/{id}", web::delete().to(handlers::seller::delete_product))
            .route("/api/seller/stats", web::get().to(handlers::seller::get_stats))
            // Wallet
            .route("/api/wallet", web::get().to(handlers::wallet::get_balance))
            .route("/api/wallet/topup", web::post().to(handlers::wallet::topup))
            // Orders
            .route("/api/orders", web::post().to(handlers::orders::create_order))
            .route("/api/orders", web::get().to(handlers::orders::list_orders))
            .route("/api/orders/{id}", web::get().to(handlers::orders::get_order))
            // Reviews
            .route("/api/reviews/{product_id}", web::get().to(handlers::reviews::list_reviews))
            .route("/api/reviews", web::post().to(handlers::reviews::create_review))
            // Notifications
            .route("/api/notifications", web::get().to(handlers::notifications::list_notifications))
            .route("/api/notifications/{id}/read", web::put().to(handlers::notifications::mark_read))
    })
    .bind(format!("0.0.0.0:{}", port))?
    .run()
    .await
}
