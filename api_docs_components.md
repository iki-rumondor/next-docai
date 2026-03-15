components:
schemas:
ApiResponseMeta:
type: object
properties:
success:
type: boolean
message:
type: string

    SourceFilesListResponse:
      type: object
      properties:
        meta:
          $ref: "#/components/schemas/ApiResponseMeta"
        data:
          type: array
          items:
            $ref: "#/components/schemas/SourceFile"

    DocumentsListResponse:
      type: object
      properties:
        meta:
          $ref: "#/components/schemas/ApiResponseMeta"
        data:
          type: array
          items:
            $ref: "#/components/schemas/Document"

    SourceFileDetailResponse:
      type: object
      properties:
        meta:
          $ref: "#/components/schemas/ApiResponseMeta"
        data:
          $ref: "#/components/schemas/SourceFile"

    DocumentDetailResponse:
      type: object
      properties:
        meta:
          $ref: "#/components/schemas/ApiResponseMeta"
        data:
          $ref: "#/components/schemas/Document"

    LoginResponse:
      type: object
      properties:
        meta:
          $ref: "#/components/schemas/ApiResponseMeta"
        data:
          type: object
          properties:
            token:
              type: string
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            user:
              $ref: "#/components/schemas/User"

    SourceFile:
      type: object
      description: Source file yang diupload sebelum diproses oleh sistem
      properties:
        id:
          type: string
        file_name:
          type: string
        mime_type:
          type: string
        page_count:
          type: integer
        uploaded_by:
          $ref: "#/components/schemas/User"
        progress:
          type: integer
          description: "Progress pemrosesan file secara keseluruhan (0-100)"
          example: 75
        status:
          type: string
          enum:
            - uploaded
            - queued
            - processing
            - completed
            - failed
        created_at:
          type: string
          format: date-time

    Document:
      type: object
      properties:
        id:
          type: string
        job_id:
          type: string
        source_file:
          $ref: "#/components/schemas/SourceFile"
        document_type:
          $ref: "#/components/schemas/DocumentType"
        vendor:
          $ref: "#/components/schemas/Vendor"
        start_page:
          type: integer
        end_page:
          type: integer
        status:
          type: string
        fields:
          type: array
          description: Header fields hasil ekstraksi dalam bentuk key-value.
          items:
            $ref: "#/components/schemas/DocumentField"
        items:
          type: array
          description: Detail item hasil ekstraksi. Setiap objek merepresentasikan satu baris.
          items:
            $ref: "#/components/schemas/DocumentItem"

    DocumentField:
      type: object
      properties:
        key:
          type: string
          example: invoice_number
        value:
          type: string
          example: "INV-12345"

    DocumentItem:
      type: object
      description: Merepresentasikan satu baris item dalam sebuah dokumen. Strukturnya dinamis.
      additionalProperties: true
      example:
        description: "Motorcycle Spare Part"
        quantity: 10
        unit: "PCS"
        unitprice: 25.5
        amount: 255

    DocumentType:
      type: object
      properties:
        id:
          type: string
        code:
          type: string
        name:
          type: string

    Vendor:
      type: object
      properties:
        id:
          type: string
        name:
          type: string

    Job:
      type: object
      description: Merepresentasikan proses ekstraksi untuk satu dokumen logis.
      properties:
        id:
          type: string
        document_id:
          type: string
        status:
          type: string
          enum: [queued, extracting, completed, failed]
        progress:
          type: number
          description: Progress ekstraksi untuk job ini (0-100).
        created_at:
          type: string
          format: date-time
        updated_at:
          type: string
          format: date-time

    JobDetailResponse:
      type: object
      properties:
        meta:
          $ref: "#/components/schemas/ApiResponseMeta"
        data:
          $ref: "#/components/schemas/Job"

    User:
      type: object
      properties:
        id:
          type: string
        name:
          type: string
        email:
          type: string
        role:
          type: string
          enum: [admin, operator]
          example: operator

    UsersListResponse:
      type: object
      properties:
        meta:
          $ref: "#/components/schemas/ApiResponseMeta"
        data:
          type: array
          items:
            $ref: "#/components/schemas/User"

    UserDetailResponse:
      type: object
      properties:
        meta:
          $ref: "#/components/schemas/ApiResponseMeta"
        data:
          $ref: "#/components/schemas/User"
