package com.careerpivot.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class CareerPivotBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(CareerPivotBackendApplication.class, args);
	}

}
