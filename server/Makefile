dockr:
	docker rm -f demo-server || true
	docker build . -f docker/.Dockerfile --tag pollos-trees-server
	docker create --name pollos-trees-server pollos-trees-server

fmt:
	black ./pkg --check

fmt.fix:
	black ./pkg

lint:
	pylint ./pkg --rcfile .pylintrc