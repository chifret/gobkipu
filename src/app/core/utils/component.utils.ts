"use strict";

import {ComponentFactoryResolver, ComponentRef, Injector, Type, ViewContainerRef} from "@angular/core";

export class ComponentUtils {

    static addComponent(item: Type<any>, viewContainerRef: ViewContainerRef, injector: Injector): ComponentRef<any> {
        const factory = injector.get(ComponentFactoryResolver);
        const tmp = factory.resolveComponentFactory(item);
        return viewContainerRef.createComponent(tmp);
    }
}
