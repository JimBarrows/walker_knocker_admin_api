# Walker Knocker Admin api

A graphql API for administering the app.  This includes uploading and modifying address data as well as users.  You also get reports and other management data here.

# Development
## Running as separate docker instances:
Run them in this order.  Note that the party-db instance will take a while to actually fire up.  It loads quite a bit of data before finally coming up.  This only happens when you start the image from scratch.

1) `docker run -d -p 5432:543 --name party-db erpmicroservices/party-db:2.1.0`
2) `docker run -d --link party-db:party-db --volume ./:/user/src/app --label-file label_file --name walker_knocker_admin_api thejimbarrows/walker_knocker_admin_api` 
3) `docker run -p 80:80 -p 8080:8080 -v /var/run/docker.sock:/var/run/docker.sock -v /dev/null:/traefik.toml traefik --web --docker --docker.domain=docker.localhost --logLevel=DEBUG`

## Faster ways

You can do either `docker-compose up` or `npm start`
