package com.bcx.plat.core.controller;

import com.bcx.plat.core.entity.BusinessObject;
import com.bcx.plat.core.entity.BusinessObjectPro;
import com.bcx.plat.core.service.BusinessObjectProService;
import com.bcx.plat.core.utils.ServiceResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.converter.json.MappingJacksonValue;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.bcx.plat.core.utils.UtilsTool.collectToSet;
import static com.bcx.plat.core.utils.UtilsTool.isValid;

/**
 * Created by Went on 2017/8/1.
 */
@Controller
@RequestMapping("/businObjPro")
public class BusinessObjectProController {

    @Autowired
    private BusinessObjectProService businessObjectProService;
    /**
     * 查询业务对象属性
     * 输入空格分隔的查询关键字（对象代码、对象名称、关联表）
     * @param str
     * @return
     */
    @RequestMapping("/select")
    @ResponseBody
    public MappingJacksonValue select(String str, HttpServletRequest request){
        Map<String, Object> map = new HashMap<>();
        map.put("strArr", collectToSet(str));
        List<BusinessObjectPro> result = businessObjectProService.select(map);
        MappingJacksonValue value = new MappingJacksonValue(new ServiceResult("查询业务对象成功", result));
        value.setJsonpFunction(isValid(request.getParameter("callback")) ? request.getParameter("callback") : "callback");
        return value;
    }

    /**
     * 新增业务对象属性
     * @param businessObjectPro
     * @return
     */
    @RequestMapping("/insert")
    @ResponseBody
    public MappingJacksonValue insert(BusinessObjectPro businessObjectPro, HttpServletRequest request){
        String insert = businessObjectProService.insert(businessObjectPro);
        MappingJacksonValue value = new MappingJacksonValue(new ServiceResult("新增业务对象成功",insert));
        value.setJsonpFunction(isValid(request.getParameter("callback"))?request.getParameter("callback"):"callback");
        return value;
    }

    /**
     * 删除业务对象属性
     * @param rowId
     * @return
     */
    @RequestMapping("/delete")
    @ResponseBody
    public MappingJacksonValue dalete(String rowId,HttpServletRequest request){
        int dalete = businessObjectProService.delete(rowId);
        MappingJacksonValue value = new MappingJacksonValue(new ServiceResult("删除数据成功",dalete));
        value.setJsonpFunction(isValid(request.getParameter("callback"))?request.getParameter("callback"):"callback");
        return value;
    }
}
