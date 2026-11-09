# Using the OnHit Event

https://dev.epicgames.com/documentation/en-us/unreal-engine/using-the-onhit-event?application_version=5.9

> A tutorial to for using the OnHit Event in Unreal.

[image: Using the OnHit Event]

Programming Language

×C++

Select an option from the dropdown to see content relevant to it.

Imagine you are creating a game that involves any kind of damage to a player, enemy, or object. In that case, chances are you will encounter a situation where you need to determine if those objects were hit by something and if so, what hit them, where the impact point was, or other information regarding the hit detected.
The **OnHit Event** provides this information when the collision occurs, then you can use the data to drive changes in your game. Whether it affects health, destroys an object, or causes other gameplay-related actions.

In this tutorial, you will use the **OnComponentHit** and **Function** Events (-> events-in-unreal-engine) to apply damage to an Actor that will be represented by changing the Actor's mesh material. The Events will also apply an impulse at the hit location to push the Actor, simulating the effects of being hit by a projectile and applying force at the hit location.

## Project Setup

- Begin by creating a new **Games** > **First Person** > **C++** Project named **OnHit**.

## Creating the Mesh Material

- Navigate to the **Content Browser**, and find the **LevelPrototyping/Materials **folder.
- Select **MI_SolidBlue**, then duplicate (**CTRL+ D**) and rename the newly duplicated asset **MI_Solid_Red**.
- Double-click to open the asset, then select and edit the **Base Color** to the color red.
- **Save **the Asset.

## Creating the Cube Actor

- In the **Editor**, click **Add(+)** > **New C++ Class**, then choose** Actor** as your parent class and name your class **Cube**.
- Declare the following class defaults in your `cube.h` file C++ ```
UPROPERTY(EditDefaultsOnly, BlueprintReadWrite)
         class UStaticMeshComponent* CubeMesh;

         UPROPERTY(EditDefaultsOnly, BlueprintReadWrite)
         UMaterialInstance* CubeMaterial;

         UPROPERTY(EditDefaultsOnly, BlueprintReadWrite)
         UMaterialInstance* DamagedCubeMaterial;

         FTimerHandle DamageTimer;
```
- Next, in your `cube.cpp` file, declare the following class libraries. C++ ```
#include "Kismet/GameplayStatics.h"
     #include "OnHitProjectile.h"
``` #include "Kismet/GameplayStatics.h" #include "OnHitProjectile.h"
- Navigate to the cube constructor and implement the following functionality. C++ ```
ACube::ACube()
     {
         CubeMesh = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("CubeMesh"));
         DamagedCubeMaterial = CreateDefaultSubobject<UMaterialInstance>(TEXT("DamageMaterial"));
         CubeMaterial = CreateDefaultSubobject<UMaterialInstance>(TEXT("CubeMaterial"));

         CubeMesh->SetSimulatePhysics(true);
     }
``` ACube::ACube() { CubeMesh = CreateDefaultSubobject(TEXT("CubeMesh")); DamagedCubeMaterial = CreateDefaultSubobject(TEXT("DamageMaterial")); CubeMaterial = CreateDefaultSubobject(TEXT("CubeMaterial")); CubeMesh->SetSimulatePhysics(true); }

### Implementing the Damage functionality

Now that you created a cube, you need to implement a function that sets the mesh's material when it receives damage, then after a delay resets the mesh back to its original material.

- Declare the following code in your `cube.h` file. C++ ```
void OnTakeDamage();

         void ResetDamage();
``` void OnTakeDamage(); void ResetDamage();
- Navigate to the `cube.cpp` file and implement the following for the `ACube::BeginPlay` function. C++ ```
void ACube::BeginPlay()
     {
        CubeMesh->OnComponentHit.AddDynamic(this, &ACube::OnComponentHit);
     }
``` void ACube::BeginPlay() { CubeMesh->OnComponentHit.AddDynamic(this, &ACube::OnComponentHit); }
- Implement the `ACube::OnTakeDamage` function. C++ ```
void ACube::OnTakeDamage()
     {

         CubeMesh->SetMaterial(0, DamagedCubeMaterial);
         GetWorld()->GetTimerManager().SetTimer(DamageTimer, this, &ACube::ResetDamage, 1.5f, false);
     }
``` void ACube::OnTakeDamage() { CubeMesh->SetMaterial(0, DamagedCubeMaterial); GetWorld()->GetTimerManager().SetTimer(DamageTimer, this, &ACube::ResetDamage, 1.5f, false); }
- Next, implement the `ACube::ResetDamage` function. C++ ```
void ACube::ResetDamage()
     {
         CubeMesh->SetMaterial(0,CubeMaterial);
     }
``` void ACube::ResetDamage() { CubeMesh->SetMaterial(0,CubeMaterial); }
- Finally, navigate to the `ACube::OnComponentHit` function and implement the following code. C++ ```
void ACube::OnComponentHit(UPrimitiveComponent* HitComp, AActor* OtherActor, UPrimitiveComponent* OtherComp, FVector NormalImpulse, const FHitResult& Hit)
     {
     if (AOnHitProjectile* HitActor = Cast<AOnHitProjectile>(OtherActor))
     {

         UGameplayStatics::ApplyDamage(this, 20.0f, nullptr, OtherActor, UDamageType::StaticClass());
         OnTakeDamage();

     }
     }
``` void ACube::OnComponentHit(UPrimitiveComponent* HitComp, AActor* OtherActor, UPrimitiveComponent* OtherComp, FVector NormalImpulse, const FHitResult& Hit) { if (AOnHitProjectile* HitActor = Cast(OtherActor)) { UGameplayStatics::ApplyDamage(this, 20.0f, nullptr, OtherActor, UDamageType::StaticClass()); OnTakeDamage(); } }
- Compile your code.
- In the editor, navigate to **C++ Classes **> **Cube** then right-click on the **Cube Actor** and select **Create Blueprint class based on Cube**.
- From the Components tab, select the **Cube Mesh**, then navigate to **Details** > **Static Mesh** and select the **SM_ChamferCube** asset.
- In the class defaults of the **BP_Cube**, set the **Cube Material** to the **MI_Solid_Blue** asset, and the **Damaged Cube Material** to the **MI_Solid_Red** asset.
- **Compile** and **Save**.

### CubeActor.h

 C++

```
#pragma once

		#include "CoreMinimal.h"
		#include "GameFramework/Actor.h"
		#include "Cube.generated.h"

		UCLASS()
		class ONHIT_API ACube : public AActor
		{
			GENERATED_BODY()
```

### CubeActor.cpp

 C++

```
#include "Cube.h"
		#include "Kismet/GameplayStatics.h"
		#include "OnHitProjectile.h"

		// Sets default values
		ACube::ACube()
		{
			// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
			PrimaryActorTick.bCanEverTick = true;
```

## Setting up the Level

- Drag the** BP_Cube** into the level from the **Content Browser**.
- Navigate to the **Outliner** > **Simulated Cubes**, select all **SM_ChauferCubes** then right-click and select **Replace Selected Actors with** > **BP_Cube**.
- Click **Play** to play in the editor and use the left-mouse button to fire a projectile at the cube.
- When you play in the editor, you will see that when you hit the cube with the projectile fired it causes the cube to take damage and change its mesh material, and applies an impulse at the location where it was hit causing it to move opposite the direction of the projectile.
- The amount of force applied is defined inside the `OnHitProjectile.cpp` file which uses the **OnHit** function to determine when the projectile actually hits something. C++ ```
void AOnHitCPPProjectile::OnHit(UPrimitiveComponent* HitComp, AActor* OtherActor, UPrimitiveComponent* OtherComp, FVector NormalImpulse, const FHitResult& Hit)
     {

         // Only add impulse and destroy projectile if we hit a physics
         if ((OtherActor != nullptr) && (OtherActor != this) && (OtherComp != nullptr) && OtherComp->IsSimulatingPhysics())
         {
             OtherComp->AddImpulseAtLocation(GetVelocity() * 100.0f, GetActorLocation());

             Destroy();
         }
```

- blueprints
- programming
- blueprint

On this page

- Project Setup (-> using-the-onhit-event)
- Creating the Mesh Material (-> using-the-onhit-event)
- Creating the Cube Actor (-> using-the-onhit-event)
- Implementing the Damage functionality (-> using-the-onhit-event)
- CubeActor.h (-> using-the-onhit-event)
- CubeActor.cpp (-> using-the-onhit-event)
- Setting up the Level (-> using-the-onhit-event)
