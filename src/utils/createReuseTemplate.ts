// utils/createReuseTemplate.ts
import {
    defineComponent,
    h,
    type VNode,
    type FunctionalComponent,
    type SlotsType,
    type EmitsOptions,
    type ComponentPropsOptions
} from 'vue'

type TemplateContext<Props, Events extends string, Slots> =
    Props &
    { [K in Events as `on${Capitalize<K>}`]?: (...args: any[]) => void } & {
        $emit: (event: Events, ...args: any[]) => void
        $slots: { [K in keyof Slots]: () => VNode[] }
        $scopedSlots: Slots
        listeners: Record<string, (...args: any[]) => void>
    }

export const createReuseTemplate = <
    Props extends Record<string, any> = {},
    Events extends string = string,
    Slots extends Record<string, (scope: any) => VNode[]> = {}
>() => {
    type Context = TemplateContext<Props, Events, Slots>

    const templateMap = new Map<string, (ctx: Context) => VNode>()
    const scopedSlotsMap = new Map<string, Slots>()

    const DefineTemplate: FunctionalComponent<{ name?: string }> = (props, { slots }) => {
        const name = props.name || 'default'

        if (slots.default) {
            templateMap.set(name, (ctx: Context) => {
                const { $emit, $slots, $scopedSlots, ...ctxProps } = ctx
                const result = slots.default?.(ctxProps)
                return Array.isArray(result) ? result[0] : result as any
            })

            const scopedSlots = {} as Slots
            for (const [slotName, slotFn] of Object.entries(slots)) {
                if (slotName !== 'default' && typeof slotFn === 'function') {
                    scopedSlots[slotName as keyof Slots] = slotFn as Slots[keyof Slots]
                }
            }

            scopedSlotsMap.set(name, scopedSlots)
        }

        return h('template', { style: { display: 'none' } })
    }

    DefineTemplate.props = {
        name: {
            type: String,
            default: 'default'
        }
    }

    const UseTemplate = defineComponent<Props>({
        name: 'UseTemplate',
        inheritAttrs: false,
        props: {
            name: {
                type: String,
                default: 'default'
            },
            ...(Object as unknown as ComponentPropsOptions<Props>)
        },
        emits: {} as EmitsOptions,
        slots: Object as SlotsType<Slots>,
        setup(props, { attrs, emit, slots }) {
            return () => {
                const name = (props as { name?: string }).name || 'default'
                const templateFn = templateMap.get(name)

                if (!templateFn) {
                    console.warn(`🚧 模板 "${name}" 未定义`)
                    return null
                }

                const scopedSlots = scopedSlotsMap.get(name) || {} as Slots

                const ctx: any = {
                    ...props,
                    $emit: emit,
                    $slots: Object.fromEntries(
                        Object.entries(slots).map(([key, fn]) => [key, () => fn?.() ?? []])
                    ),
                    $scopedSlots: scopedSlots,
                    listeners: {}
                }

                for (const key in attrs) {
                    if (key.startsWith('on') && typeof attrs[key] === 'function') {
                        const eventName = key.slice(2).toLowerCase()
                        ctx.listeners[eventName] = attrs[key]
                    } else {
                        ctx[key] = attrs[key]
                    }
                }

                return templateFn(ctx)
            }
        }
    })

    return [DefineTemplate, UseTemplate] as const
}
