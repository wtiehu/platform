package com.bcx.plat.core.service;

import com.bcx.BaseTest;
import com.bcx.plat.core.entity.DBTableColumn;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.bcx.plat.core.utils.UtilsTool.lengthUUID;

/**
 * Create By HCL at 2017/8/1
 */
@Transactional
public class DBTableColumnServiceTest extends BaseTest {

    @Autowired
    private DBTableColumnService dbTableColumnService;

    /**
     * 测试开始数据库操作
     */
    @Test
    @Rollback
    public void test() {
        // 测试查询方法
        List<DBTableColumn> list = dbTableColumnService.select(null);
        assert (null != list);
        // 测试新增方法
        DBTableColumn dbTableColumn = new DBTableColumn();
        dbTableColumn.setRowId(lengthUUID(32));
        dbTableColumn.setRelateTableRowId(lengthUUID(32));
        dbTableColumn.setColumnCname(lengthUUID(8));
        dbTableColumn.setColumnEname(lengthUUID(4));
        dbTableColumn.setDesp(lengthUUID(64));
        dbTableColumnService.insert(dbTableColumn);
        // 测试更新方法
        DBTableColumn upaData = list.get(0);
        dbTableColumnService.update(upaData);
        // 测试删除方法
        dbTableColumnService.delete(dbTableColumn);
    }
}