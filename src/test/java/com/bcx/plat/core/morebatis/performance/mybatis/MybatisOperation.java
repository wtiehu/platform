package com.bcx.plat.core.morebatis.performance.mybatis;

import java.util.List;
import java.util.Map;

public interface MybatisOperation {
    List<Map<String,Object>> select(Object object);

}