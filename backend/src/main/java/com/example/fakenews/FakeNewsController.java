
package com.example.fakenews;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import java.util.*;

@RestController
@CrossOrigin
public class FakeNewsController {

    @PostMapping("/detect")
    public Map<String,Object> detect(@RequestBody Map<String,String> body){

        String text = body.get("text");

        RestTemplate restTemplate = new RestTemplate();

        Map<String,String> req = new HashMap<>();
        req.put("text", text);

        Map response = restTemplate.postForObject(
            "http://localhost:5000/predict",
            req,
            Map.class
        );

        return response;
    }
}
