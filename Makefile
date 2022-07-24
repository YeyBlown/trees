postgres.create:
	 docker create --name postgresql -e POSTGRES_USER=myusername -e POSTGRES_PASSWORD=mypassword -p 5432:5432 -v /data\:/var/lib/postgresql/data postgres

postgres.run:
	docker start postgresql

postgres.stop:
	docker stop postgresql

dockr:
	# backend
	make -C server/ dockr
	# frontend
	make -C client/ dockr

run:
	make -C docker/ run

stop:
	make -C docker/ stop

db.upgrade:
	make -C server/ db.upgrade
