package io.sage.BeesCaatinga.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController("/helloworld")
public class HelloWorld {

    @GetMapping
    public String hello(){
        return "Hello, World!";
    }

}
