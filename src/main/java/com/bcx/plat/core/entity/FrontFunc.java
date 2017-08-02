package com.bcx.plat.core.entity;

import com.bcx.plat.core.base.BaseEntity;
import com.bcx.plat.core.database.action.annotations.Table;
import com.bcx.plat.core.database.action.annotations.TablePK;
import com.bcx.plat.core.database.info.TableInfo;

import static com.bcx.plat.core.utils.UtilsTool.lengthUUID;

/**
 * 前端功能块实体类
 * Created by Went on 2017/8/2.
 */
@Table(TableInfo.T_FRONT_FUNC)
public class FrontFunc extends BaseEntity<FrontFunc> {

    @TablePK
    private String rowId;//唯一标示
    private String funcCode;//功能代码
    private String funcName;//功能名称
    private String funcType;//功能类型
    private String relateBusiObj;//关联业务对象
    private String wetherAvailable;//是否可用
    private String desp;//说明

    /**
     * 构建 - 创建信息
     *
     * @return 返回自身
     */
    @Override
    public FrontFunc buildCreateInfo() {
        setRowId(lengthUUID(32));
        return super.buildCreateInfo();
    }

    public String getRowId() {
        return rowId;
    }

    public void setRowId(String rowId) {
        this.rowId = rowId;
    }

    public String getFuncCode() {
        return funcCode;
    }

    public void setFuncCode(String funcCode) {
        this.funcCode = funcCode;
    }

    public String getFuncName() {
        return funcName;
    }

    public void setFuncName(String funcName) {
        this.funcName = funcName;
    }

    public String getFuncType() {
        return funcType;
    }

    public void setFuncType(String funcType) {
        this.funcType = funcType;
    }

    public String getRelateBusiObj() {
        return relateBusiObj;
    }

    public void setRelateBusiObj(String relateBusiObj) {
        this.relateBusiObj = relateBusiObj;
    }

    public String getWetherAvailable() {
        return wetherAvailable;
    }

    public void setWetherAvailable(String wetherAvailable) {
        this.wetherAvailable = wetherAvailable;
    }

    public String getDesp() {
        return desp;
    }

    public void setDesp(String desp) {
        this.desp = desp;
    }
}
