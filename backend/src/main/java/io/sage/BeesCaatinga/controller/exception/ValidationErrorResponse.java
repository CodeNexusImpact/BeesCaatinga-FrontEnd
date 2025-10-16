package io.sage.BeesCaatinga.controller.exception;

import java.time.LocalDateTime;
import java.util.List;

public class ValidationErrorResponse extends ErrorResponse{
    private final List<GlobalExceptionHandler.FieldValidationError> fieldErrors;

    public ValidationErrorResponse(int status, String error, String message,
                                   LocalDateTime timestamp,
                                   List<GlobalExceptionHandler.FieldValidationError> fieldErrors) {
        super(status, error, message, timestamp);
        this.fieldErrors = fieldErrors;
    }

    public List<GlobalExceptionHandler.FieldValidationError> getFieldErrors() {
        return fieldErrors;
    }
}
