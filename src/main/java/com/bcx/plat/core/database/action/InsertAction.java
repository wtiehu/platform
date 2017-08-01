package com.bcx.plat.core.database.action;

import com.bcx.plat.core.database.action.phantom.TableSource;

import java.util.*;

public class InsertAction {
    private TableSource tableSource;
    private Collection<String> columns;
    private List<Map<String,Object>> rows;
    private List<List<Object>> values;

    public List<List<Object>> getValues() {
        return values;
    }

    public String getValuesRefresh(){
        LinkedList<List<Object>> values=new LinkedList<>();
        for (Map<String, Object> row : rows) {
            List<Object> rowValue=new LinkedList<>();
            for (String column : columns) {
                rowValue.add(row.get(column));
            }
            values.add(rowValue);
        }
        this.values=values;
        return "";
    }

    public TableSource getTableSource() {
        return tableSource;
    }

    public void setTableSource(TableSource tableSource) {
        this.tableSource = tableSource;
    }

    public Collection<String> getColumns() {
        return columns;
    }

    public void setColumns(Collection<String> columns) {
        this.columns = columns;
    }

    public List<Map<String, Object>> getRows() {
        return rows;
    }

    public void setRows(List<Map<String, Object>> rows) {
        this.rows = rows;
    }

    public InsertAction into(TableSource table){
        setTableSource(table);
        return this;
    }

    public InsertAction cols(Collection<String> columns){
        setColumns(columns);
        return this;
    }

    public InsertAction values(List<Map<String,Object>> rows){
        setRows(rows);
        return this;
    }
}