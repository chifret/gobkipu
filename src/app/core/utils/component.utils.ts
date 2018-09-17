"use strict";

import { ComponentRef, ViewContainerRef, ComponentFactoryResolver, Type, ReflectiveInjector, Injector, EmbeddedViewRef, ApplicationRef } from "@angular/core";

export class ComponentUtils {

    static addComponent(item: Type<any>, viewContainerRef: ViewContainerRef, injector: Injector): ComponentRef<any> {
        const factory = injector.get(ComponentFactoryResolver);
        const tmp = factory.resolveComponentFactory(item);
        return viewContainerRef.createComponent(tmp);
    }

    static addComponent2(item: Type<any>, viewContainerRef: ViewContainerRef, destination: HTMLElement, injector: Injector, appRef: ApplicationRef): ComponentRef<any> {
        const factory = injector.get(ComponentFactoryResolver);
        const tmp = factory.resolveComponentFactory(item);
        const vcRef = viewContainerRef.createComponent(tmp)
        appRef.attachView(vcRef.hostView);
        destination.appendChild((vcRef.hostView as EmbeddedViewRef<any>).rootNodes[0]);
        return vcRef;
    }

    static getComponentWithoutDomAdding(item: Type<any>, viewContainerRef: ViewContainerRef, injector: Injector): ComponentRef<any> {
        const factory = injector.get(ComponentFactoryResolver);
        const tmp = factory.resolveComponentFactory(item);
        return tmp.create(ReflectiveInjector.fromResolvedProviders([], viewContainerRef.parentInjector));
    }

    static appendComponentToDom(item: ComponentRef<any>, destination: HTMLElement): void {
        destination.appendChild((item.hostView as EmbeddedViewRef<any>).rootNodes[0]);
    }

    // this one attach the component to the appRef
    static getComponentAttachedWithoutDomAdding(item: Type<any>, viewContainerRef: ViewContainerRef, injector: Injector, appRef: ApplicationRef): ComponentRef<any> {
        const factory = injector.get(ComponentFactoryResolver);
        const tmp = factory.resolveComponentFactory(item);
        return tmp.create(ReflectiveInjector.fromResolvedProviders([], viewContainerRef.parentInjector));
    }

    /*appendElement(div: HTMLElement, component: ComponentRef<any>): void {
        const div = document.createElement("div") as HTMLDivElement;
        div.appendChild((component.hostView as EmbeddedViewRef<any>).rootNodes[0]);
    }*/
}
