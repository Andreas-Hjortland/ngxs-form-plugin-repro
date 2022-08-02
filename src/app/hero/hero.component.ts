import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UpdateFormDirty } from '@ngxs/form-plugin';
import { Select, Store } from '@ngxs/store';
import { map, Observable, switchMap } from 'rxjs';
import { AppState, HeroState, SaveHeroChanges } from '../app-state';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements OnInit {
  @Select(AppState.selectHero)
  private readonly getHero!: Observable<ReturnType<typeof AppState['selectHero']>>;

  public hero$!: Observable<HeroState | undefined>;
  public formPath!: string;
  public heroId!: string;

  public readonly heroForm = new FormGroup({
    name: new FormControl(),
    rating: new FormControl(),
  });

  constructor(
    private readonly route: ActivatedRoute,
    private readonly store: Store,
  ) { }

  ngOnInit(): void {
    const id$ = this.route.paramMap.pipe(
      map(params => params.get('id')!)
    );

    this.hero$ = id$.pipe(
      switchMap((id) => this.getHero.pipe(
        map(heroes => heroes(id))
      ))
    );

    id$.subscribe(id => {
      this.heroId = id;
      this.formPath = `app.heroes.${id}.form`;
    });
  }

  onSubmit() {
    this.store.dispatch([
      new UpdateFormDirty({
        dirty: false,
        path: this.formPath,
      }),
      new SaveHeroChanges(
        this.heroId,
        this.heroForm.get('name')!.value,
        this.heroForm.get('rating')!.value
      ),
    ]);
  }
}
