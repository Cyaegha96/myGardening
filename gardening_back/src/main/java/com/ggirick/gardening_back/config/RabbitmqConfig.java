package com.ggirick.gardening_back.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.connection.CachingConnectionFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitmqConfig {

    @Value("${spring.rabbitmq.host}")
    private String host;

    @Value("${spring.rabbitmq.username}")
    private String username;

    @Value("${spring.rabbitmq.password}")
    private String password;

    @Value("${spring.rabbitmq.port}")
    private int port;

    /** Exchanges */
    @Bean
    DirectExchange appExchange() {
        return new DirectExchange("app.exchange");
    }

    @Bean
    DirectExchange dlxExchange() {
        return new DirectExchange("app.dlx");
    }

    @Bean
    DirectExchange parkingExchange() {
        return new DirectExchange("app.parking.exchange");
    }

    /** ---------- CHAT queues ---------- */
    // Main chat queue: 메시지가 consumer에서 reject되면 DLX로 보냄
    @Bean
    Queue chatQueue() {
        Queue q = new Queue("chat.queue", true);
        q.addArgument("x-dead-letter-exchange", "app.dlx");
        q.addArgument("x-dead-letter-routing-key", "chat.delay.key");
        return q;
    }

    // Delay queue for chat: TTL 1초, 만료되면 다시 app.exchange 로 되돌림 (main key)
    @Bean
    Queue chatDelayQueue() {
        Queue q = new Queue("chat.delay.queue", true);
        q.addArgument("x-message-ttl", 1000); // 1s
        q.addArgument("x-dead-letter-exchange", "app.exchange");
        q.addArgument("x-dead-letter-routing-key", "chat.main.key");
        return q;
    }

    // Parking queue: 재시도 초과 시 보관(또는 소비자가 DB 저장 후 이 큐에 보낼 수 있음)
    @Bean
    Queue chatParkingQueue() {
        return new Queue("chat.parking.queue", true);
    }

    /** Bindings for chat */
    @Bean
    Binding bindChatMain() {
        return BindingBuilder.bind(chatQueue()).to(appExchange()).with("chat.main.key");
    }

    @Bean
    Binding bindChatDelay() {
        return BindingBuilder.bind(chatDelayQueue()).to(dlxExchange()).with("chat.delay.key");
    }

    @Bean
    Binding bindChatParking() {
        return BindingBuilder.bind(chatParkingQueue()).to(parkingExchange()).with("chat.parking.key");
    }

    /** ---------- NOTIFICATION queues (same pattern) ---------- */
    @Bean
    Queue notificationQueue() {
        Queue q = new Queue("notification.queue", true);
        q.addArgument("x-dead-letter-exchange", "app.dlx");
        q.addArgument("x-dead-letter-routing-key", "notification.delay.key");
        return q;
    }

    @Bean
    Queue notificationDelayQueue() {
        Queue q = new Queue("notification.delay.queue", true);
        q.addArgument("x-message-ttl", 1000); // 1s
        q.addArgument("x-dead-letter-exchange", "app.exchange");
        q.addArgument("x-dead-letter-routing-key", "notification.main.key");
        return q;
    }

    @Bean
    Queue notificationParkingQueue() {
        return new Queue("notification.parking.queue", true);
    }

    @Bean
    Binding bindNotificationMain() {
        return BindingBuilder.bind(notificationQueue()).to(appExchange()).with("notification.main.key");
    }

    @Bean
    Binding bindNotificationDelay() {
        return BindingBuilder.bind(notificationDelayQueue()).to(dlxExchange()).with("notification.delay.key");
    }

    @Bean
    Binding bindNotificationParking() {
        return BindingBuilder.bind(notificationParkingQueue()).to(parkingExchange()).with("notification.parking.key");
    }

    /** Connection / Template / Converter */
    @Bean
    ConnectionFactory connectionFactory() {
        CachingConnectionFactory factory = new CachingConnectionFactory();
        factory.setHost(host);
        factory.setPort(port);
        factory.setUsername(username);
        factory.setPassword(password);
        // 필요시 factory.setVirtualHost(...) 등 추가
        return factory;
    }

    @Bean
    MessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory, MessageConverter converter) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(converter);
        return template;
    }
}
