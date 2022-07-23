dockr:
	docker rm -f demo-client || true
	docker build . -f docker/.Dockerfile --tag pollos-trees-client
	docker create --name pollos-trees-client pollos-trees-client