package com.entitymatrix.ngsm.app.common;

import java.io.IOException;
import java.lang.reflect.Type;
import java.util.Optional;

import org.springframework.http.HttpOutputMessage;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageNotWritableException;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.http.converter.json.MappingJacksonValue;
import org.springframework.util.TypeUtils;

import com.fasterxml.jackson.core.JsonEncoding;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.util.DefaultIndenter;
import com.fasterxml.jackson.core.util.DefaultPrettyPrinter;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.ser.FilterProvider;

import lombok.Getter;

public class CustomJsonResponseMapper extends MappingJackson2HttpMessageConverter {

    private final ObjectMapper prettyPrintObjectMapper;

    public CustomJsonResponseMapper() {
        super();
        prettyPrintObjectMapper = initiatePrettyObjectMapper();
    }

    /**
     * Initiates pretty format capable ObjectMapper
     * @return ObjectMapper
     */
    public ObjectMapper initiatePrettyObjectMapper() {
        // clone and re-configure default object mapper
        final ObjectMapper prettyObjectMapper = objectMapper != null ? objectMapper.copy() : new ObjectMapper();
        prettyObjectMapper.configure(SerializationFeature.INDENT_OUTPUT, true);

        // for arrays - use new line for every entry
        DefaultPrettyPrinter pp = new DefaultPrettyPrinter();
        pp.indentArraysWith(new DefaultIndenter());
        prettyObjectMapper.setDefaultPrettyPrinter(pp);

        return prettyObjectMapper;
    }

    /**
     * Overridden as if Json response to be printed as pretty or not
     */
    @Override
    protected void writeInternal(final Object objectToWrite, final Type type, final HttpOutputMessage outputMessage) throws IOException, HttpMessageNotWritableException {

        // based on: if objectToWrite is PrettyFormattedBody with isPretty == true => use custom formatter
        // otherwise - use the default one

        final Optional<PrettyFormattedBody> prettyFormatted = Optional.ofNullable(objectToWrite)
                .filter(o -> o instanceof PrettyFormattedBody)
                .map(o -> (PrettyFormattedBody) objectToWrite);

        final boolean pretty = prettyFormatted.map(PrettyFormattedBody::isPretty).orElse(false);
        final Object realObject = prettyFormatted.map(PrettyFormattedBody::getBody).orElse(objectToWrite);

        if (pretty) {
            // this is basically full copy of super.writeInternal(), but with custom (pretty) object mapper
            MediaType contentType = outputMessage.getHeaders().getContentType();
            JsonEncoding encoding = getJsonEncoding(contentType);
            JsonGenerator generator = this.prettyPrintObjectMapper.getFactory().createGenerator(outputMessage.getBody(), encoding);
            try {
                writePrefix(generator, realObject);

                Class<?> serializationView = null;
                FilterProvider filters = null;
                Object value = realObject;
                JavaType javaType = null;
                if (realObject instanceof MappingJacksonValue) {
                    MappingJacksonValue container = (MappingJacksonValue) realObject;
                    value = container.getValue();
                    serializationView = container.getSerializationView();
                    filters = container.getFilters();
                }
                if (type != null && value != null && TypeUtils.isAssignable(type, value.getClass())) {
                    javaType = getJavaType(type, null);
                }
                ObjectWriter objectWriter;
                if (serializationView != null) {
                    objectWriter = this.prettyPrintObjectMapper.writerWithView(serializationView);
                } else if (filters != null) {
                    objectWriter = this.prettyPrintObjectMapper.writer(filters);
                } else {
                    objectWriter = this.prettyPrintObjectMapper.writer();
                }
                if (javaType != null && javaType.isContainerType()) {
                    objectWriter = objectWriter.forType(javaType);
                }

                objectWriter.writeValue(generator, value);

                writeSuffix(generator, realObject);
                generator.flush();

            } catch (JsonProcessingException ex) {
                throw new HttpMessageNotWritableException("Could not write JSON: " + ex.getOriginalMessage(), ex);
            }
        } else {
            // use default formatting if isPretty property is not specified
            super.writeInternal(realObject, type, outputMessage);
        }
    }

    /**
     * This is mandatory overridden,
     * otherwise writeInternal() won't be called with custom PrettyFormattedBody type
     */
    @Override
    public boolean canWrite(Class<?> clazz, MediaType mediaType) {
        return (PrettyFormattedBody.class.equals(clazz) && canWrite(mediaType)) || super.canWrite(clazz, mediaType);
    }

    @Getter
    public static final class PrettyFormattedBody {
        private final Object body;
        private final boolean pretty;

        public PrettyFormattedBody(Object body, boolean pretty) {
            this.body = body;
            this.pretty = pretty;
        }
    }
}
