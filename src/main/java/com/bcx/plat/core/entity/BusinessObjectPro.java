package com.bcx.plat.core.entity;

import com.bcx.plat.core.base.BaseEntity;

import java.io.Serializable;

/**
 * 业务对象属性实体类
 * Created by Went on 2017/8/1.
 */
public class BusinessObjectPro extends BaseEntity<BusinessObjectPro> implements Serializable{

    private String rowId;//唯一标识
    private String propertyCode;//业务对象属性代码
    private String propertyName;//业务对象属性名称
    private String relateTableColumn;//关联表字段
    private String valueType;//值类型
    private String valueResourceType;//值来源类型
    private String valueResourceContent;//值来源内容
    private String wetherExpandPro;//是否为扩展属性

    public String getRowId() {
        return rowId;
    }

    public void setRowId(String rowId) {
        this.rowId = rowId;
    }

    public String getPropertyCode() {
        return propertyCode;
    }

    public void setPropertyCode(String propertyCode) {
        this.propertyCode = propertyCode;
    }

    public String getPropertyName() {
        return propertyName;
    }

    public void setPropertyName(String propertyName) {
        this.propertyName = propertyName;
    }

    public String getRelateTableColumn() {
        return relateTableColumn;
    }

    public void setRelateTableColumn(String relateTableColumn) {
        this.relateTableColumn = relateTableColumn;
    }

    public String getValueType() {
        return valueType;
    }

    public void setValueType(String valueType) {
        this.valueType = valueType;
    }

    public String getValueResourceType() {
        return valueResourceType;
    }

    public void setValueResourceType(String valueResourceType) {
        this.valueResourceType = valueResourceType;
    }

    public String getValueResourceContent() {
        return valueResourceContent;
    }

    public void setValueResourceContent(String valueResourceContent) {
        this.valueResourceContent = valueResourceContent;
    }

    public String getWetherExpandPro() {
        return wetherExpandPro;
    }

    public void setWetherExpandPro(String wetherExpandPro) {
        this.wetherExpandPro = wetherExpandPro;
    }
}