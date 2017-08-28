package com.bcx.plat.core.controller;

import com.bcx.plat.core.common.BaseControllerTemplate;
import com.bcx.plat.core.entity.TemplateObject;
import com.bcx.plat.core.entity.TemplateObjectPro;
import com.bcx.plat.core.service.TemplateObjectProService;
import com.bcx.plat.core.service.TemplateObjectService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

/**
 * <p>Title: TemplateObjectProController</p>
 * <p>Description: 模板对象属性控制层</p>
 * <p>Copyright: Shanghai Batchsight GMP Information of management platform, Inc. Copyright(c) 2017</p>
 *
 * @author Wen TieHu
 * @version 1.0
 *          <pre>Histroy:
 *                2017/8/28  Wen TieHu Create
 *          </pre>
 */
@RestController
@RequestMapping("/core/templateObjPro")
public class TemplateObjectProController extends BaseControllerTemplate<TemplateObjectProService,TemplateObjectPro>{

    @Override
    protected List<String> blankSelectFields() {
        return Arrays.asList("code","cname","ename");
    }
}
