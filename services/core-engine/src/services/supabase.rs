use reqwest::Client;
use serde::{Deserialize, Serialize};
use crate::services::AppState;

#[derive(Debug, Serialize, Deserialize)]
#[allow(dead_code)]
pub struct SupabaseResponse<T> {
    pub data: Option<T>,
    pub error: Option<SupabaseError>,
}

#[derive(Debug, Serialize, Deserialize)]
#[allow(dead_code)]
pub struct SupabaseError {
    pub message: String,
    pub code: Option<String>,
    pub details: Option<String>,
}

pub struct SupabaseClient {
    client: Client,
    url: String,
    key: String,
}

impl SupabaseClient {
    pub fn new(state: &AppState) -> Self {
        Self {
            client: Client::new(),
            url: state.supabase_url.clone(),
            key: state.supabase_key.clone(),
        }
    }

    pub async fn query<T: for<'de> Deserialize<'de>>(
        &self,
        table: &str,
        query: &str,
    ) -> Result<T, String> {
        let url = format!("{}/rest/v1/{}?{}", self.url, table, query);

        let response = self.client
            .get(&url)
            .header("apikey", &self.key)
            .header("Authorization", format!("Bearer {}", self.key))
            .header("Content-Type", "application/json")
            .send()
            .await
            .map_err(|e| format!("Request failed: {}", e))?;

        response.json::<T>().await.map_err(|e| format!("Parse failed: {}", e))
    }

    pub async fn insert<T: Serialize, R: for<'de> Deserialize<'de>>(
        &self,
        table: &str,
        data: &T,
    ) -> Result<R, String> {
        let url = format!("{}/rest/v1/{}", self.url, table);

        let response = self.client
            .post(&url)
            .header("apikey", &self.key)
            .header("Authorization", format!("Bearer {}", self.key))
            .header("Content-Type", "application/json")
            .header("Prefer", "return=representation")
            .json(data)
            .send()
            .await
            .map_err(|e| format!("Request failed: {}", e))?;

        response.json::<R>().await.map_err(|e| format!("Parse failed: {}", e))
    }

    pub async fn update<T: Serialize, R: for<'de> Deserialize<'de>>(
        &self,
        table: &str,
        id: &str,
        data: &T,
    ) -> Result<R, String> {
        let url = format!("{}/rest/v1/{}?id=eq.{}", self.url, table, id);

        let response = self.client
            .patch(&url)
            .header("apikey", &self.key)
            .header("Authorization", format!("Bearer {}", self.key))
            .header("Content-Type", "application/json")
            .header("Prefer", "return=representation")
            .json(data)
            .send()
            .await
            .map_err(|e| format!("Request failed: {}", e))?;

        response.json::<R>().await.map_err(|e| format!("Parse failed: {}", e))
    }

    pub async fn delete(
        &self,
        table: &str,
        id: &str,
    ) -> Result<(), String> {
        let url = format!("{}/rest/v1/{}?id=eq.{}", self.url, table, id);

        self.client
            .delete(&url)
            .header("apikey", &self.key)
            .header("Authorization", format!("Bearer {}", self.key))
            .send()
            .await
            .map_err(|e| format!("Request failed: {}", e))?;

        Ok(())
    }
}
