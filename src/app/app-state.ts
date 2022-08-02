import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";

export type HeroState = {
    name: string;
    rating: number;
};

type AppStateModel = {
    heroes: {
        [key: string]: {
            entity: HeroState,
            form: {
                model: HeroState
            }
        }
    };
};

export class SaveHeroChanges {
    public static readonly type = '[Hero Page] Save hero changes'
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly rating: number,
    ) { }
}

@State<AppStateModel>({
    name: 'app',
    defaults: {
        heroes: {
            superman: {
                entity: {
                    name: 'Superman',
                    rating: 10,
                },
                form: {
                    model: {
                        name: 'Superman',
                        rating: 10,
                    }
                }
            },
            batman: {
                entity: {
                    name: 'Batman',
                    rating: 8,
                },
                form: {
                    model: {
                        name: 'Batman',
                        rating: 8,
                    }
                }
            },
            wonderwoman: {
                entity: {
                    name: 'Wonder woman',
                    rating: 11,
                },
                form: {
                    model: {
                        name: 'Wonder woman',
                        rating: 11,
                    }
                }
            },
        },
    }
})
@Injectable()
export class AppState {
    @Selector()
    static heroes(state: AppStateModel) {
        return Object.entries(state.heroes).map(([id, hero]) => ({
            id,
            ...(hero.entity)
        }));
    }

    @Selector()
    static selectHero(state: AppStateModel) {
        return (id: string) => state.heroes[id]?.entity;
    }

    @Action(SaveHeroChanges)
    updateHero(ctx: StateContext<AppStateModel>, action: SaveHeroChanges) {
        const heroes = ctx.getState().heroes;
        ctx.patchState({
            heroes: {
                ...heroes,
                [action.id]: {
                    entity: {
                        name: action.name,
                        rating: action.rating
                    },
                    form: heroes[action.id].form,
                }
            }
        })
    }
}