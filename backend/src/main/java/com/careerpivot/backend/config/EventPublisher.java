package com.careerpivot.backend.config;

public interface EventPublisher {
    void publish(String topic, Object payload);
}
