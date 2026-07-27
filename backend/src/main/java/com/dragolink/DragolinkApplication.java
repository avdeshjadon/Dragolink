package com.dragolink;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication(exclude = org.springframework.boot.autoconfigure.kafka.KafkaAutoConfiguration.class)
@EnableCaching
public class DragolinkApplication {

    public static void main(String[] args) {
        SpringApplication.run(DragolinkApplication.class, args);
    }

}
