> prCheckList

### Lazy Loading
- [ ] Any API for not above the fold content.
- [ ] Maps and other scripts.
- [ ] Images

### Images
- [ ] Images Optimized
- [ ] Loading 2x images only for Graphic Artwork (only if needed)
- [ ] Load Smallest Size just larger than the container for Photos (no 2x for photos)

### CSS
- [ ] CSS in a file wrapped by container class to not pollute global namespace
- [ ] 3rd Level of specificity for overrides.
- [ ] No more than 3rd level specificity, that too in extreme cases. 4th allowed only in extreme case.
- [ ] Used Prefixer for transform, transition.
- [ ] `vertical-align:top\anything` for `inline-block`

### CSS Specificity Guide
1. For IDs and container class
2. For Elements in Container
3. For Modifier (Selected State, Active/Disabled State etc.)
4. For Extreme Overrides.

### JS
- [ ] radix for parseInt
- [ ] Avoid creating static functions in classes. Just create a normal function outside class

### React 
- [ ] state should not contain anything that can be calculated from props. 
- [ ] state should not contain anything that is not being used for rendering.


[Link](https://twitter.com/dan_abramov/status/749710501916139520/photo/1?ref_src=twsrc%5Etfw) for react state checks 

The above checklist is available at https://github.com/loconsolutions/housing-mobile/blob/master/PULL_REQUEST_TEMPLATE.md
