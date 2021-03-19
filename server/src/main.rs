use actix_files::Files;
use actix_web::{App, HttpServer, middleware};

#[actix_web::main]
async fn main() -> Result<(), actix_web::Error> {
    std::env::set_var("RUST_LOG", "info");
    env_logger::init();

    HttpServer::new(|| {
        App::new()
            .wrap(middleware::Logger::default())
            .service(Files::new("/", "./static/root").index_file("index.html"))
    })
    .bind("localhost:8080")?
    .run()
    .await?;

    Ok(())
}