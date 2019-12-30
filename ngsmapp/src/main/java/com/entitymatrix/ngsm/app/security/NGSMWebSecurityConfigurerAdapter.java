package com.entitymatrix.ngsm.app.security;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

/**
 * Custom {@link WebSecurityConfigurerAdapter}
 * @author ashemez
 *
 */
@Configuration
@EnableWebSecurity
public class NGSMWebSecurityConfigurerAdapter extends WebSecurityConfigurerAdapter {    
	@Resource(name = "ngsmdsJdbcTemplate")
	private JdbcTemplate ngsmdsJdbcTemplate;

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {    	
        auth.jdbcAuthentication().dataSource(ngsmdsJdbcTemplate.getDataSource())
        	.authoritiesByUsernameQuery("SELECT username, 'ROLE' AS authority FROM ngsm.users WHERE username=?")
            .usersByUsernameQuery("SELECT username, password, enabled FROM ngsm.users WHERE username=?")
            .passwordEncoder(passwordEncoder());
    }

    @Value("${security.enable-csrf}")
    private boolean csrfEnabled;
    
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
	        //.antMatchers("/admin/**").hasRole("ADMIN")
        	//.antMatchers("/anonymous*").anonymous()
	        .antMatchers("/login*").permitAll()
	        .anyRequest().authenticated()
	        .and()
	        .formLogin()
	        //.loginPage("/login.html")
	        //.loginProcessingUrl("/perform_login")
	        .defaultSuccessUrl("/index", true)
	        //.failureUrl("/login.html?error=true")
	        .failureHandler(authFailureHandler())
	        .and()
	        .logout()
	        .logoutUrl("/perform_logout")
	        .deleteCookies("JSESSIONID")
	        .logoutSuccessHandler(logoutSuccessHandler());
        
        if(!csrfEnabled)
        {
        	http.csrf().disable();
        }
    }
    
	@Bean
	NGSMLogoutSuccessHandler logoutSuccessHandler() {
		return new NGSMLogoutSuccessHandler();
	}
	
	@Bean
	NGSMAuthFailureHandler authFailureHandler() {
		return new NGSMAuthFailureHandler();
	}
	
	@Bean
	NGSMAccessDeniedHandler accessDeniedHandler() {
		return new NGSMAccessDeniedHandler();
	}

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
}

