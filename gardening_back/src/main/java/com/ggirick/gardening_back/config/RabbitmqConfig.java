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

    /** 메인 익스체인지 */
    @Bean
    DirectExchange directExchange() {
        return new DirectExchange("hello1.exchange");
    }

    /** DLX 익스체인지 */
    @Bean
    DirectExchange dlxExchange() {
        return new DirectExchange("dlx");
    }

    /** 원본 큐 */
    @Bean
    Queue queue() {
        Queue queue = new Queue("hello1.queue", true);
        queue.addArgument("x-dead-letter-exchange", "dlx");
        queue.addArgument("x-dead-letter-routing-key", "delay.key");
        return queue;
    }

    /** 딜레이 큐 (TTL 1초) */
    @Bean
    public Queue delayQueue() {
        Queue queue = new Queue("hello1.dead.queue", true);
        queue.addArgument("x-message-ttl", 1000);
        queue.addArgument("x-dead-letter-exchange", "dlx");
        queue.addArgument("x-dead-letter-routing-key", "main.key");
        return queue;
    }

    /** 원본 큐 바인딩 */
    @Bean
    Binding bindingMain() {
        return BindingBuilder.bind(queue())
                .to(dlxExchange())     // DLX가 재전송 시 여기로 보냄
                .with("main.key");
    }

    /** 딜레이 큐 바인딩 */
    @Bean
    Binding bindingDelay() {
        return BindingBuilder.bind(delayQueue())
                .to(dlxExchange())
                .with("delay.key");
    }

    // Producer가 이용할 실제 exchange
    @Bean
    Binding producerBinding() {
        return BindingBuilder.bind(queue())
                .to(directExchange())
                .with("hello1.key");
    }

    @Bean
    ConnectionFactory connectionFactory() {
        CachingConnectionFactory factory = new CachingConnectionFactory();
        factory.setHost(host);
        factory.setPort(port);
        factory.setUsername(username);
        factory.setPassword(password);
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

