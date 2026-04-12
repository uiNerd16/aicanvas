Component: Meet the Crew
Slug: meet-the-crew
design-system: standalone
Description: A swipeable portrait card stack for browsing and selecting a crew member.
Visual: Four portrait photo cards (174×218px, radius 20) stacked with soft rotations and offsets — front card centered, the three behind it peeking out to the sides and back. Uppercase label at the top. Dot indicator below the stack. Action row at the bottom.
Behaviour:
  - Drag the front card left or right — flick far enough (offset > 80px or velocity > 400) and it flies off screen, rotates, then snaps back to the bottom of the stack.
  - Tap the front card (drag delta < 8px) to select/deselect — teal ring (#2DD4BF) appears around the card and a checkmark badge animates in.
  - Dot indicator: active dot widens to a pill (width 20), inactive dots are small (width 5). Spring animated.
  - Action row: shows "swipe to browse" hint when nothing is selected. When a crew member is selected, shows a teal pill button with their name + checkmark. Clicking deselects.
  - dualTheme: true — light and dark versions.
Tech notes: Framer Motion springs throughout. Dismissing guard ref to prevent double-dismiss. orderRef mirrors order state for stable callbacks. Two-RAF pattern for snap-back transition.
