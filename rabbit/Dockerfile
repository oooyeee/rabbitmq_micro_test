FROM rabbitmq:management-alpine

# ENV RABBITMQ_NODE_IP_ADDRESS=""
# ENV RABBITMQ_NODENAME=rabbit@$HOSTNAME


# RUN rabbitmqctl add_user requester password

# RUN rabbitmqctl add_user tasker password && \
#     rabbitmqctl add_vhost /myvhost
    

# RUN rabbitmqadmin --vhost=/myvhost declare queue name=requests_queue durable=true && \
#     rabbitmqadmin --vhost=/myvhost declare queue name=tasks_queue durable=true && \
#     rabbitmqctl set_permissions -p /myvhost requester "" "requests_queue" "tasks_queue" && \
#     rabbitmqctl set_permissions -p /myvhost tasker "" "tasks_queue" "requests_queue" && \
RUN rabbitmq-plugins enable rabbitmq_management
#  && \
#     rabbitmq-plugins enable rabbitmq_prometheus

# RUN apt-get update && \
#     apt-get install -y curl && \
#     apt-get install -y python3

EXPOSE 5672
EXPOSE 15672