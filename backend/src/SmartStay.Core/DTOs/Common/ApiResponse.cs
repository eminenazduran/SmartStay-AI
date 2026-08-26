using System;
using System.Collections.Generic;

namespace SmartStay.Core.DTOs.Common
{
    /// <summary>
    /// API genelinde standartlastirilmis yanit zarfi (Response Envelope).
    /// </summary>
    /// <typeparam name="T">Yanit veri tipi</typeparam>
    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public T? Data { get; set; }
        public List<string>? Errors { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        public static ApiResponse<T> SuccessResponse(T data, string message = "Islem basariyla tamamlandi.")
        {
            return new ApiResponse<T>
            {
                Success = true,
                Message = message,
                Data = data,
                Timestamp = DateTime.UtcNow
            };
        }

        public static ApiResponse<T> ErrorResponse(string message, List<string>? errors = null)
        {
            return new ApiResponse<T>
            {
                Success = false,
                Message = message,
                Errors = errors ?? new List<string>(),
                Timestamp = DateTime.UtcNow
            };
        }
    }
}
