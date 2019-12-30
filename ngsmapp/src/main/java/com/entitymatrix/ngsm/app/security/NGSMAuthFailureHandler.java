package com.entitymatrix.ngsm.app.security;

import com.entitymatrix.ngsm.lib.common.ResponseDTO;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;

// this is currently not used in the CustomWebSecurityConfigurerAdapter
@Component
public class NGSMAuthFailureHandler implements AuthenticationFailureHandler {
    
    private ObjectMapper objectMapper = new ObjectMapper();
    
    @Override
    public void onAuthenticationFailure(
      HttpServletRequest request,
      HttpServletResponse response,
      AuthenticationException exception) 
      throws IOException, ServletException {
  
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        Map<String, Object> data = new HashMap<String, Object>();
        data.put(
          "timestamp", 
          Calendar.getInstance().getTime());
        data.put(
          "exception", 
          exception.getMessage());
 
        response.getOutputStream()
          .println(objectMapper.writeValueAsString(data));
    }
}
