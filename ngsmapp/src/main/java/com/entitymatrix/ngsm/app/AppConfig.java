package com.entitymatrix.ngsm.app;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.jdbc.core.JdbcTemplate;

import com.entitymatrix.ngsm.app.common.CustomJsonResponseMapper;
import com.zaxxer.hikari.HikariDataSource;

@Configuration
public class AppConfig {
	@Bean(name="ngsmds")
	@Primary
	@ConfigurationProperties("ngsmds.datasource")
	public DataSourceProperties emsDataSourceProperties() {
		return new DataSourceProperties();
	}

	@Bean
	@Primary
	@ConfigurationProperties("ngsmds.datasource.configuration")
	public HikariDataSource emsDataSource() {
		return emsDataSourceProperties().initializeDataSourceBuilder().type(HikariDataSource.class).build();
	}

	@Bean(name = "ngsmdsJdbcTemplate")
	@Autowired
	public JdbcTemplate emsstagingJdbcTemplate() {
		return new JdbcTemplate(emsDataSource());
	}
	
    @Bean
    MappingJackson2HttpMessageConverter mappingJackson2HttpMessageConverter1() {
        return new CustomJsonResponseMapper();
    }

}
