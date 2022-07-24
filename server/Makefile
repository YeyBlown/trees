dockr:
	docker rm -f demo-server || true
	docker build . -f docker/.Dockerfile --tag pollos-trees-server
	docker create --name trees-server pollos-trees-server

fmt:
	black ./pkg --check

fmt.fix:
	black ./pkg

lint:
	pylint ./pkg --rcfile .pylintrc

db.upgrade:
	# TODO: add to server script(docker image) or create separate
	psql -c 'create database maindb;' postgresql://myusername:mypassword@localhost:5432 || true
	alembic upgrade head