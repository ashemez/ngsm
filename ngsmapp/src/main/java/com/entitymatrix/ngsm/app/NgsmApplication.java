package com.entitymatrix.ngsm.app;

import com.entitymatrix.ngsm.lib.service.MyService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication(scanBasePackages = "com.entitymatrix.ngsm")
@Controller
public class NgsmApplication {

	private final MyService myService;

	public NgsmApplication(MyService myService) {
		this.myService = myService;
	}

	@GetMapping("/")
	public String home() {
		return myService.message();
	}

	public static void main(String[] args) {
		SpringApplication.run(NgsmApplication.class, args);
	}
}
