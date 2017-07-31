package com.bcx.plat.core.utils;

import com.bcx.BaseTest;
import org.junit.Test;

import java.util.HashMap;
import java.util.Map;

import static com.bcx.plat.core.utils.UtilsTool.jsonToObj;
import static com.bcx.plat.core.utils.UtilsTool.objToJson;

/**
 * 测试工具类中的方法
 */
public class UtilsToolTest extends BaseTest {

    /**
     * 对工具类中的方法进行测试
     */
    @Test
    public void testMethod() {
        // 测试 json 的互转功能
        Map<String, Object> map = new HashMap<>();
        map.put("A", "2017-07-28");
        String jsonMap = objToJson(map);
        HashMap map1 = jsonToObj(jsonMap, HashMap.class);
        assert (null != map1 && map1.get("A").equals(map.get("A")));
    }

}