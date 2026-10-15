
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  
  "public": {
          Tables: {
            "categorias": {
                  Row: {
                    "arquivada": boolean,"criado_em": string,"grupo": Database["public"]['Enums']["grupo_categoria"],"id": string,"nome": string,"ordem": number,"usuario_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "arquivada"?: boolean,"criado_em"?: string,"grupo": Database["public"]['Enums']["grupo_categoria"],"id"?: string,"nome": string,"ordem"?: number,"usuario_id": string
                  }
                  Update: {
                    "arquivada"?: boolean,"criado_em"?: string,"grupo"?: Database["public"]['Enums']["grupo_categoria"],"id"?: string,"nome"?: string,"ordem"?: number,"usuario_id"?: string
                  }
                  Relationships: [
                    
                  ]
                },"configuracoes": {
                  Row: {
                    "atualizado_em": string,"faixa_1": number,"faixa_2": number,"faixa_3": number,"previsao_conta_diario": boolean,"saldo_inicial_centavos": number,"saldo_inicial_data": string,"usuario_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "atualizado_em"?: string,"faixa_1"?: number,"faixa_2"?: number,"faixa_3"?: number,"previsao_conta_diario"?: boolean,"saldo_inicial_centavos"?: number,"saldo_inicial_data"?: string,"usuario_id": string
                  }
                  Update: {
                    "atualizado_em"?: string,"faixa_1"?: number,"faixa_2"?: number,"faixa_3"?: number,"previsao_conta_diario"?: boolean,"saldo_inicial_centavos"?: number,"saldo_inicial_data"?: string,"usuario_id"?: string
                  }
                  Relationships: [
                    
                  ]
                },"lancamentos": {
                  Row: {
                    "atualizado_em": string,"categoria_id": string | null,"criado_em": string,"data": string,"descricao": string,"editado_manual": boolean,"grupo_id": string | null,"id": string,"parcela_numero": number | null,"parcela_total": number | null,"recorrencia_id": string | null,"reserva_id": string | null,"tipo": Database["public"]['Enums']["tipo_lancamento"],"usuario_id": string,"valor_centavos": number
                  }
                  ComputedFields: never
                  Insert: {
                    "atualizado_em"?: string,"categoria_id"?: string | null,"criado_em"?: string,"data": string,"descricao"?: string,"editado_manual"?: boolean,"grupo_id"?: string | null,"id"?: string,"parcela_numero"?: number | null,"parcela_total"?: number | null,"recorrencia_id"?: string | null,"reserva_id"?: string | null,"tipo": Database["public"]['Enums']["tipo_lancamento"],"usuario_id": string,"valor_centavos": number
                  }
                  Update: {
                    "atualizado_em"?: string,"categoria_id"?: string | null,"criado_em"?: string,"data"?: string,"descricao"?: string,"editado_manual"?: boolean,"grupo_id"?: string | null,"id"?: string,"parcela_numero"?: number | null,"parcela_total"?: number | null,"recorrencia_id"?: string | null,"reserva_id"?: string | null,"tipo"?: Database["public"]['Enums']["tipo_lancamento"],"usuario_id"?: string,"valor_centavos"?: number
                  }
                  Relationships: [
                    {
      foreignKeyName: "lancamentos_categoria_id_usuario_id_fkey"
      columns: ["categoria_id","usuario_id"]
isOneToOne: false
      referencedRelation: "categorias"
      referencedColumns: ["id","usuario_id"]
    },{
      foreignKeyName: "lancamentos_recorrencia_id_usuario_id_fkey"
      columns: ["recorrencia_id","usuario_id"]
isOneToOne: false
      referencedRelation: "recorrencias"
      referencedColumns: ["id","usuario_id"]
    },{
      foreignKeyName: "lancamentos_reserva_id_usuario_id_fkey"
      columns: ["reserva_id","usuario_id"]
isOneToOne: false
      referencedRelation: "reservas"
      referencedColumns: ["id","usuario_id"]
    }
                  ]
                },"perfis": {
                  Row: {
                    "criado_em": string,"id": string,"nome": string
                  }
                  ComputedFields: never
                  Insert: {
                    "criado_em"?: string,"id": string,"nome"?: string
                  }
                  Update: {
                    "criado_em"?: string,"id"?: string,"nome"?: string
                  }
                  Relationships: [
                    
                  ]
                },"recorrencias": {
                  Row: {
                    "categoria_id": string | null,"criado_em": string,"descricao": string,"dia_do_mes": number,"fim": string | null,"gerado_ate": string,"id": string,"inicio": string,"reserva_id": string | null,"tipo": Database["public"]['Enums']["tipo_lancamento"],"usuario_id": string,"valor_centavos": number
                  }
                  ComputedFields: never
                  Insert: {
                    "categoria_id"?: string | null,"criado_em"?: string,"descricao"?: string,"dia_do_mes": number,"fim"?: string | null,"gerado_ate": string,"id"?: string,"inicio": string,"reserva_id"?: string | null,"tipo": Database["public"]['Enums']["tipo_lancamento"],"usuario_id": string,"valor_centavos": number
                  }
                  Update: {
                    "categoria_id"?: string | null,"criado_em"?: string,"descricao"?: string,"dia_do_mes"?: number,"fim"?: string | null,"gerado_ate"?: string,"id"?: string,"inicio"?: string,"reserva_id"?: string | null,"tipo"?: Database["public"]['Enums']["tipo_lancamento"],"usuario_id"?: string,"valor_centavos"?: number
                  }
                  Relationships: [
                    {
      foreignKeyName: "recorrencias_categoria_id_usuario_id_fkey"
      columns: ["categoria_id","usuario_id"]
isOneToOne: false
      referencedRelation: "categorias"
      referencedColumns: ["id","usuario_id"]
    },{
      foreignKeyName: "recorrencias_reserva_id_usuario_id_fkey"
      columns: ["reserva_id","usuario_id"]
isOneToOne: false
      referencedRelation: "reservas"
      referencedColumns: ["id","usuario_id"]
    }
                  ]
                },"reservas": {
                  Row: {
                    "arquivada": boolean,"criado_em": string,"id": string,"meta_centavos": number | null,"nome": string,"ordem": number,"saldo_inicial_centavos": number,"usuario_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "arquivada"?: boolean,"criado_em"?: string,"id"?: string,"meta_centavos"?: number | null,"nome": string,"ordem"?: number,"saldo_inicial_centavos"?: number,"usuario_id": string
                  }
                  Update: {
                    "arquivada"?: boolean,"criado_em"?: string,"id"?: string,"meta_centavos"?: number | null,"nome"?: string,"ordem"?: number,"saldo_inicial_centavos"?: number,"usuario_id"?: string
                  }
                  Relationships: [
                    
                  ]
                }
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "criar_dados_iniciais":
{ Args: { "p_data"?: string,"p_saldo_centavos"?: number }; Returns: undefined
                           },
"saldo_antes_de":
{ Args: { "p_data": string }; Returns: number
                           }
          }
          Enums: {
            "grupo_categoria": "saida"|"entrada","tipo_lancamento": "entrada"|"saida"|"diario"
          }
          CompositeTypes: {
            [_ in never]: never
          }
        }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  "public": {
          Enums: {
            "grupo_categoria": ["saida", "entrada"],"tipo_lancamento": ["entrada", "saida", "diario"]
          }
        }
} as const
