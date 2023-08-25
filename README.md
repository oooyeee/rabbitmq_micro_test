> ## test repo for rabbitmq + node  
> this repo contains multi-worspace npm (+vscode) projects  
> ###  __*requires*__ 
> * docker (docker desktop)  
> * npm v18
> * powershell 7 or bash (wsl)
---

## to build and run in docker:
```bash
./run.ps1   - on powershell
or
./run.sh    - on bash
```

## to read pretty logs run
```bash
./logs.ps1   - on powershell
or
./logs.sh    - on bash
```

# to test requests run
* app on [__*localhost:8080*__](localhost:8080) and click on buttons
> or  
* open swagger on [__*localhost:9091/swagger*__](localhost:9091/swagger) and click on buttons

## rabbitmq management ui
* open [localhost:9090](localhost:9090)  
    - admin user: __rabbit__  
    - password: __password__  

> __*logall_queue*__ collects all messages  
> __*requests_queue*__ collects request messages from microservice M1  
> __*tasks_queue*__ collects task messages from microservice M1  
> user __requester__ can read from __*tasks_queue*__  
> user __tasker__ can read from __*requests_queue*__  
> both users write to __messaging_echange__

