// src-tauri/src/main.rs

use scrap::{Capturer, Display};
use std::io::ErrorKind;

#[tauri::command]
async fn capture_screen() -> Result<Vec<u8>, String> {
    let display = Display::primary().map_err(|e| e.to_string())?;
    let mut capturer = Capturer::new(display).map_err(|e| e.to_string())?;
    let frame = loop {
        match capturer.frame() {
            Ok(buffer) => break buffer.to_vec(),
            Err(error) if error.kind() == ErrorKind::WouldBlock => continue,
            Err(error) => return Err(error.to_string()),
        }
    };
    Ok(frame)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![capture_screen])
        .run(tauri::generate_context!())
        .expect("error while running Tauri application");
}
