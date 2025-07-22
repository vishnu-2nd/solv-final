interface ApiResponse<T = any> {
  data?: T
  error?: string
  success: boolean
}

interface FetchOptions extends RequestInit {
  timeout?: number
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: Response
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function apiRequest<T = any>(
  url: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  const { timeout = 10000, ...fetchOptions } = options

  try {
    // Create abort controller for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    // Get content type
    const contentType = response.headers.get('content-type') || ''
    
    // Handle different response types
    let responseData: any = null
    
    if (contentType.includes('application/json')) {
      const responseText = await response.text()
      
      if (responseText.trim()) {
        try {
          responseData = JSON.parse(responseText)
        } catch (parseError) {
          console.error('JSON Parse Error:', parseError)
          console.error('Response Text:', responseText)
          throw new ApiError(
            'Invalid JSON response from server',
            response.status,
            response
          )
        }
      }
    } else if (response.status !== 204) {
      // For non-JSON responses (except 204 No Content)
      const textResponse = await response.text()
      console.warn('Non-JSON response received:', textResponse)
      
      if (!response.ok) {
        throw new ApiError(
          textResponse || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          response
        )
      }
    }

    if (!response.ok) {
      const errorMessage = responseData?.error || 
                          responseData?.message || 
                          `HTTP ${response.status}: ${response.statusText}`
      
      throw new ApiError(errorMessage, response.status, response)
    }

    return {
      success: true,
      data: responseData,
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new ApiError('Request timeout', 408)
      }
      
      throw new ApiError(
        error.message || 'Network error occurred',
        0
      )
    }
    
    throw new ApiError('Unknown error occurred', 0)
  }
}

// Specific API functions
export const adminApi = {
  createUser: async (userData: {
    email: string
    name: string
    password: string
    role: 'admin' | 'super_admin'
  }) => {
    return apiRequest('/api/admin/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
  },
}