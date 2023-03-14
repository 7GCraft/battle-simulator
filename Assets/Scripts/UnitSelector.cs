using System.Collections.Generic;
using UnityEngine;

public class UnitSelector : MonoBehaviour
{
    [SerializeField] private Transform selectionArea;

    private List<Unit> selectedUnits;
    private Vector3 startPosition;

    private void Awake()
    {
        selectedUnits = new List<Unit>();

        selectionArea.gameObject.SetActive(false);
    }

    // Update is called once per frame
    private void Update()
    {
        if (Input.GetMouseButtonDown(0))
        {
            StartSelection();
        }

        if (Input.GetMouseButton(0))
        {
            AdjustSelectionAreaSize();
        }

        if (Input.GetMouseButtonUp(0))
        {
            SelectUnits();
        }
    }

    private void StartSelection()
    {
        selectionArea.gameObject.SetActive(true);

        startPosition = GetMouseWorldPosition();
    }

    private void AdjustSelectionAreaSize()
    {
        Vector3 currentMousePosition = GetMouseWorldPosition();
        Vector3 lowerLeftPoint = new Vector3(
            Mathf.Min(startPosition.x, currentMousePosition.x),
            Mathf.Min(startPosition.y, currentMousePosition.y)
        );
        Vector3 upperRightPoint = new Vector3(
            Mathf.Max(startPosition.x, currentMousePosition.x),
            Mathf.Max(startPosition.y, currentMousePosition.y)
        );

        selectionArea.position = lowerLeftPoint;
        selectionArea.localScale = upperRightPoint - lowerLeftPoint;
    }

    private void SelectUnits()
    {
        selectionArea.gameObject.SetActive(false);

        Collider2D[] colliders = Physics2D.OverlapAreaAll(startPosition, GetMouseWorldPosition());

        foreach (Unit unit in selectedUnits)
        {
            unit.Deselect();
        }

        selectedUnits.Clear();

        foreach (Collider2D collider in colliders)
        {
            Unit unit = collider.GetComponent<Unit>();

            if (unit != null)
            {
                unit.Select();
                selectedUnits.Add(unit);
            }
        }
    }

    private Vector3 GetMouseWorldPosition()
    {
        Vector3 rawPosition = Camera.main.ScreenToWorldPoint(Input.mousePosition);
        Vector3 worldPosition = new Vector3(rawPosition.x, rawPosition.y, 0f);

        return worldPosition;
    }
}
