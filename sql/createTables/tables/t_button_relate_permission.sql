DROP TABLE IF EXISTS public.t_button_relate_permission;

CREATE TABLE public.t_button_relate_permission (
  "row_id"            VARCHAR(64) NOT NULL PRIMARY KEY,
  "permission_row_id" VARCHAR(64),
  "button_row_id"     VARCHAR(64),

  delete_flag         VARCHAR(4),
  etc                 JSONB DEFAULT '{}' :: JSONB
);
COMMENT ON TABLE public.t_button_relate_permission IS '按钮权限关联表';